import { ThemeFile } from "../components/Common";

/**
    * Downloads the loaded theme onto the user's machine.
   *
   * @param filename - inputted from interface provided by ../components/PreviewButtonsGroup.tsx
   *
   */


export default function download(themeFile: ThemeFile, filename: string): void{
    // create a new Blob object with the file content and type
    const blob = new Blob([`return{\n\
        colors.accent = '${themeFile.accent}'\n\
        colors.bg = '${themeFile.bg}'\n\
        colors.fg = '${themeFile.fg}'\n\
        colors.ui = '${themeFile.ui}'\n\
        colors.tag = '#55B4D4'\n\
        colors.func = '${themeFile.func}'\n\
        colors.entity = '#399EE6'\n\
        colors.string = '${themeFile.string}'\n\
        colors.regexp = '#4CBF99'\n\
        colors.markup = '#F07171'\n\
        colors.keyword = '#FA8D3E'\n\
        colors.special = '#E6BA7E'\n\
        colors.comment = '${themeFile.error}'\n\
        colors.constant = '#A37ACC'\n\
        colors.operator = '${themeFile.operator}'\n\
        colors.error = '${themeFile.error}'\n\
        colors.line = '#EFF0F1'\n\
        colors.panel_bg = '#FFFFFF'\n\
        colors.panel_shadow = '#CCCED0'\n\
        colors.panel_border = '#F0F0F0'\n\
        colors.gutter_normal = '#CDD0D3'\n\
        colors.gutter_active = '#A0A6AC'\n\
        colors.selection_bg = '#D1E4F4'\n\
        colors.selection_inactive = '#E7E8E9'\n\
        colors.selection_border = '#E1E1E2'\n\
        colors.guide_active = '#D3D5D8'\n\
        colors.guide_normal = '#E6E7E9'\n\
        colors.vcs_added = '#99BF4D'\n\
        colors.vcs_modified = '#709ECC'\n\
        colors.vcs_removed = '#F27983'\n\
        colors.vcs_added_bg = '#E0E7CD'\n\
        colors.vcs_removed_bg = '#F9EBE4'\n\
        colors.fg_idle = '#828C99'\n\
        colors.warning = '#FA8D3E'\n\
    } \n\
`], { type: "text/plain" });

    // create a URL to the blob object
    const url = URL.createObjectURL(blob);

    // create a new anchor element with the download attribute and href set to the URL
    if(filename != ""){
        const link = document.createElement("a");
        link.download = filename + ".lua";
        link.href = url;
        link.click(); // simulate a click on the link element to trigger the download
    }
    URL.revokeObjectURL(url); // cleanup the URL object
}