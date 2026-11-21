import { Injectable } from '@nestjs/common';
import { Biquad, BiquadFilter } from './biquad-filter';
import { LoudnessResult } from './loudness-result';

@Injectable()
export class LoudnessAnalyzerService {
  private kWeightingFilters(fs: number): [Biquad, Biquad] {
    const f0 = 1681.974450955533;
    const G = 3.999843853973347;
    const Q = 0.7071752369554196;

    const K1 = Math.tan((Math.PI * f0) / fs);
    const Vh = 10 ** (G / 20);
    const Vb = Vh ** 0.4996667741545416;
    const a0_1 = 1 + K1 / Q + K1 * K1;

    const shelf = new Biquad(
      (Vh + (Vb * K1) / Q + K1 * K1) / a0_1,
      (2 * (K1 * K1 - Vh)) / a0_1,
      (Vh - (Vb * K1) / Q + K1 * K1) / a0_1,
      (2 * (K1 * K1 - 1)) / a0_1,
      (1 - K1 / Q + K1 * K1) / a0_1
    )

    const f1 = 38.13547087602444;
    const Q2 = 0.5003270373238773;
    const K2 = Math.tan((Math.PI * f1) / fs);
    const a0_2 = 1 + K2 / Q2 + K2 * K2;

    const highpass = new Biquad(
      1,
      -2,
      1,
      (2 * (K2 * K2 - 1)) / a0_2,
      (1 - K2 / Q2 + K2 * K2) / a0_2
    )

    return [shelf, highpass];
  }

  private energyToLufs(energy: number): number {
    return -0.691 + 10 * Math.log10(energy);
  }

  private mean(values: number[]): number {
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  }

  public measureLoudness(channels: Float32Array[], sampleRate: number): LoudnessResult {
    if (channels.length < 1 || channels.length > 2) {
      throw new Error('Only Mono and Stereo audio is supported');
    }

    // Sample Peak: highest absolute value of all channels
    let peak = 0;
    for (const channel of channels) {
      for (let i = 0; i < channel.length; i++) {
        peak = Math.max(peak, Math.abs(channel[i]));
      }
    }
    const peakDb = 20 * Math.log10(peak); // Amplitude

    const [shelfCoeffs, highpassCoeffs] = this.kWeightingFilters(sampleRate);
    const segmentLength = Math.round(sampleRate * 0.1);
    const segmentCount = Math.floor(channels[0].length / segmentLength);
    const segmentEnergy = new Float64Array(segmentCount);

    for (const channel of channels) {
      const shelf = new BiquadFilter(shelfCoeffs);
      const highpass = new BiquadFilter(highpassCoeffs);

      for (let segment = 0; segment < segmentCount; segment++) {
        let sumOfSquares = 0;
        const start = segment * segmentLength;
        for (let i = start; i < start + segmentLength; i++) {
          const weighted = highpass.process(shelf.process(channel[i]));
          sumOfSquares += weighted * weighted;
        }
        segmentEnergy[segment] += sumOfSquares / segmentLength;
      }
    }

    const blockEnergies: number[] = [];
    for (let b = 0; b + 4 <= segmentCount; b++) {
      blockEnergies.push(
        (segmentEnergy[b] + segmentEnergy[b + 1] + segmentEnergy[b + 2] + segmentEnergy[b + 3]) / 4
      );
    }

    const aboveAbsolute = blockEnergies.filter((e) => this.energyToLufs(e) > -70);
    if (aboveAbsolute.length === 0) {
      return new LoudnessResult(-Infinity, peakDb);
    }

    const relativeThreshold = this.energyToLufs(this.mean(aboveAbsolute)) - 10;
    const aboveRelative = aboveAbsolute.filter((e) => this.energyToLufs(e) > relativeThreshold);

    return new LoudnessResult(
      this.energyToLufs(this.mean(aboveRelative)),
      peakDb
    );
  }
}
