import {NsfwCategory, SfwCategory, Type} from "./waifu_pics_api_types.ts";
import {invoke} from "@tauri-apps/api/core";


export async function fetchWaifuImageUrl(config: { type: Type; category: SfwCategory | NsfwCategory }): Promise<string> {
    try {
        return await invoke('get_waifu_image_url', { config: `{"${config.type.toString()}": "${config.category.toString()}"}`});
    } catch (error) {
        console.error('Error fetching waifu image URL:', error);
        throw error;
    }
}

export async function fetchWaifuImageUrls(config: { type: Type; category: SfwCategory | NsfwCategory }, excludedUrls: string[] = []): Promise<string[]> {
    try {
        return await invoke('get_waifu_image_urls', { config: `{"${config.type.toString()}": "${config.category.toString()}"}`, excluded: excludedUrls});
    } catch (error) {
        console.error('Error fetching waifu image URLs:', error);
        throw error;
    }
}
