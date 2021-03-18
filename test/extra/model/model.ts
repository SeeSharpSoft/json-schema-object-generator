export type Model = {
    configuration: ConfigurationModel;
    data: DataModel;
    i18n: I18nModel;
    ui: UIModel;
}

export type ConfigurationModel = {
    defaultLanguage: LanguageKey;
}

export type DataModel = {
    entities: Record<string, EntityModel>;
}

export type EntityModel = {
    /**
     * @calculated {key}
     */
    name: string;
    properties: Record<string, EntityPropertyModel>;
}

export type EntityPropertyModel = {
    name: string;
}

export type I18nModel = Record<LanguageKey, I18nTokenModel> & {
    default: I18nTokenModel;
}

/**
 * pattern \w{2}(-\w{2,3})?
 */
export type LanguageKey = string;

export type I18nTokenModel = Record<EntryKey, string>;

/**
 * pattern \w+
 */
export type EntryKey = string;

export type UIModel = {
    editors: Record<string, EditorModel>;
    views: Record<string, ViewModel>;
}

export type EditorModel = {}

export type ViewModel = {}