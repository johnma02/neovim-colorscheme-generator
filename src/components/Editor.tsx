import React from "react";
import { Box, Card, CardBody,  Grid, Tab,
    TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import DragColor from "./DragColor";
import ColorPicker from "./ColorPicker";
import ColorBucket from "./ColorBucket";
import { ThemeFile } from "./Common";
import DragTutorial from "./DragTutorial";

/**
 * Wrapper for color dragging and dropping components. 
   *
   * @remarks
   * See ./ColorBucket.tsx for drop target analog.
   *
   * @param themeFile - displayed theme
   * @param setThemeFile - corresponding state function
   *
   */


const presetCards = [
    "#DA4B4B", "#F3CA7B", "#2E9A1E", "#1E9A81", 
    "#252DDA", "#3DD8D3", "#9134AF", "#43148E", 
    "#DE42D8", "#ADB791", "#020001", "#FFFFFF"
];

interface EditorProps {
    themeFile: ThemeFile;
    setThemeFile: (x: ThemeFile) => void;
}
export default function Editor({themeFile, setThemeFile}: EditorProps): JSX.Element{
    return(
        <div>
            <DragTutorial/>
            <Tabs colorScheme="white" variant="line">
                <TabList>
                    <Tab _hover={{ textShadow: "0px 0px 1px #ccc" }}><Text>Presets</Text></Tab>
                    <Tab _hover={{ textShadow: "0px 0px 1px #ccc" }}><Text>Color Picker</Text></Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Card width="100%" height="100%" p="1">
                            <CardBody>
                                <Grid templateColumns="repeat(4,1fr)" gap={2}>
                                    {presetCards.map((x: string)=>(
                                        <DragColor key={x} fillColor={x}/>
                                    ))}
                                </Grid>
                            </CardBody>
                        </Card>
                    </TabPanel>
                    <TabPanel>
                        <Card width="100%" height="100%">
                            <CardBody>
                                <ColorPicker/>
                            </CardBody>
                        </Card>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Box padding="1rem">
                <Card width="100%" height="100%">
                    <CardBody>
                        <Grid templateColumns="repeat(3,1fr)" gap={2}>
                            {Object.keys(themeFile).map((x: string)=>(
                                <Box key={x} height="100%">
                                    <Text fontSize="10">{x}</Text>
                                    <ColorBucket
                                        theme={themeFile}
                                        setThemeFile={setThemeFile}
                                        prop={x}
                                    />
                                </Box>
                            ))}
                        </Grid>
                    </CardBody>
                </Card>
            </Box> 
        </div>    
    );
}