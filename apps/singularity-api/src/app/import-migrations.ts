const contexts = (require as any).context('../migrations', true, /\.ts$/);

export function importMigrations(): any {
  return contexts
    .keys()
    .map(modulePath => contexts(modulePath))
    .reduce((result, entityModule) => result.concat(Object.keys(entityModule).map(key => entityModule[key])), []);
}
