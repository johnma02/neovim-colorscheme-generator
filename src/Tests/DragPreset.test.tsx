import React from "react";
import { render, fireEvent, waitFor, screen} from "@testing-library/react";
import ColorPicker from "../components/ColorPicker";
import { ChakraProvider } from "@chakra-ui/provider";
import { extendTheme } from "@chakra-ui/theme-utils";
import { chakraTheme } from "../chakraTheme";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { HashRouter } from "react-router-dom";
import { ChromePicker } from "react-color";
import DragColor from "../components/DragColor";
import MatchMediaMock from "jest-matchmedia-mock";
import { renderColorBucket } from "./ColorBucket.test";
import DeletePreset from "../components/DeletePreset";
import { Preset, ThemeFile } from "../components/Common";
import delete_preset from "../functions/delete_preset";
import fetch_presets from "../functions/fetch_presets";
import Presets from "../components/Presets";

new MatchMediaMock();

export function renderDragPreset(){
    const chakTheme = extendTheme(chakraTheme);
    const colPic = render(
        <>
            <React.StrictMode>
                <ChakraProvider theme={chakTheme}>
                    <DndProvider backend={HTML5Backend}>
                        <HashRouter>
                            <DeletePreset setThemes={function (x: Preset[]): void {
                            } }/>
                        </HashRouter>
                    </DndProvider>
                </ChakraProvider>
            </React.StrictMode>
        </>
    );
    return colPic;
}

describe("PresetPostButton", () => {
    
    test("renders", () => {
        const dp =  renderDragPreset();
        expect(dp);
    });

    

    test("displays the \"Drag a preset here to delete it!\" message", () => {
        const dp = renderDragPreset();
        const delHere = dp.getByRole("flex");
        expect(delHere).toHaveTextContent("Drag a preset here to delete it!");
    });

});