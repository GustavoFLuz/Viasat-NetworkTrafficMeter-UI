import { useState, useEffect } from "react";
import { SettingsType } from "../types/Settings";

export const useSettings = () =>{
    const [current, setCurrent] = useState<SettingsType | null>(null);

    const updateCurrent = () => {
        get().then((settings) => {
            setCurrent(settings as SettingsType);
        });
    }

    useEffect(() => {
        updateCurrent();
    }, []);

    const get = (key?: string) => window.settings.get(key)

    const update = (key: string, value: any) => window.settings.update(key, value).then(updateCurrent)

    const reset = () => window.settings.reset().then(updateCurrent);

    return {
        current,
        get,
        update,
        reset
    }
}