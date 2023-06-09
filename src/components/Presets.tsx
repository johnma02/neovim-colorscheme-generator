import React from "react";
import { Accordion, AccordionButton, AccordionIcon,
    AccordionItem, AccordionPanel, Box, Button, 
    Flex, Grid, Spacer, Spinner, Text} from "@chakra-ui/react";
import DragPreset from "./DragPreset";

import { Preset, ThemeFile } from "./Common";
import {useState, useEffect} from "react";
import { SearchIcon } from "@chakra-ui/icons";
import fetch_presets from "../functions/fetch_presets";
import RegisterUserButton from "./RegisterUserButton";
import LoginButton from "./LoginButton";
import PostUserTheme from "./PostUserTheme";
import DeleteUserPreset from "./DeleteUserPreset";
import DeletePreset from "./DeletePreset";
import CentralToUser from "./CentralToUser";
import fetch_user_presets from "../functions/fetch_user_presets";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

/**
 * Wrapper component for Preset viewing, loading, and posting, as well as user login.
   *
   * @param page - tells us which HashRouter page we are on, aids in conditional rendering.
   */

interface PresetsProps{
    themeFile: ThemeFile;
    presets: Preset[];
    setPresets: (x: Preset[]) => void;
    user: Realm.User | null;
    setUser: (x: Realm.User | null) => void;
    page: string;
    setThemeFile: (x: ThemeFile) => void;
}

export default function Presets({themeFile, presets, setPresets, user, setUser, page, setThemeFile}: PresetsProps):JSX.Element{
    const [userThemes, setUserThemes] = useState<Preset[]>([]);
    
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredPresets = presets.filter(preset =>
        preset.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // hook triggers on page load.
    useEffect(() => {
        fetch_presets(setPresets);
        if(user !== null) fetch_user_presets(user.id, setUserThemes);
    }, []);
    return(
        <div>
            <Accordion defaultIndex={[0]}>
                <AccordionItem>
                    <h2>
                        <AccordionButton  _hover={{ textShadow: "0px 0px 1px #ccc" }}>
                            <Box as="span" flex='1' textAlign='left'>
                                      Presets
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        <Box pl="2" pr="2" pb="2">
                            {/* search bar */}
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none">
                                    <SearchIcon color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    type="text"
                                    placeholder="Search by preset name"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </InputGroup>
                        </Box>
                        {filteredPresets.length > 0 ?
                            <Box
                                maxHeight="65vh"
                                overflowY="scroll"
                                alignItems="center"
                                display="flex"
                                flexDirection="column"
                            >
                                {filteredPresets.map((x: Preset) => (
                                    <Box key={x._id as unknown as React.Key} w='90%'>
                                        <DragPreset 
                                            ThemeFile={x.ThemeFile}
                                            name={x.name}
                                            description={x.description}
                                            upvotes={x.upvotes}
                                            _id={x._id}
                                            isUserTheme={false}
                                            userId={""}
                                            editable={page === "edit"}
                                            setThemeFile={setThemeFile}
                                            setUserThemes={setUserThemes}
                                            setPresets={setPresets}
                                        />
                                    </Box>
                                ))
                                }
                                {page === "edit" && 
                                <Flex p="3" pb='-1' direction="column" alignContent="center" justifyContent="center">
                                    <DeletePreset setThemes={setPresets} />
                                </Flex>
                                }
                            </Box>
                            : <Box textAlign="center">
                                {presets.length > 0  ?
                                    <Text fontSize="16" fontWeight="medium">
                                        No Presets Found! <br/>
                                    </Text> :
                                    <Box>
                                        <Spinner /> 
                                        <Text fontSize="16" fontWeight="medium">
                                        Loading Presets...
                                        </Text>
                                    </Box>
                                }
                            </Box>
                        }
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <CentralToUser user={user} setUserThemes={setUserThemes}/>
                    <AccordionPanel pb={4}>
                        {user === null ? <Text>Login to load and save presets!</Text> : 
                            userThemes.length > 0 ? 
                                <Box>
                                    <Box 
                                        maxHeight="65vh"
                                        overflowY="scroll"
                                        alignItems="center"
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        {userThemes.map((x: Preset) => (
                                            <Box key={x._id as unknown as React.Key} w="90%">
                                                <DragPreset 
                                                    ThemeFile={x.ThemeFile}
                                                    name={x.name}
                                                    description={x.description}
                                                    upvotes={x.upvotes}
                                                    _id={x._id}
                                                    isUserTheme={true}
                                                    userId={user.id}
                                                    editable={true}
                                                    setThemeFile={setThemeFile}
                                                    setUserThemes={setUserThemes}
                                                    setPresets={setPresets}
                                                />
                                            </Box>
                                        ))
                                        }
                                    </Box>
                                    <Flex p="3" pb='-1' direction="column" alignContent="center" justifyContent="center">
                                        <DeleteUserPreset setThemes={setUserThemes} userId={user.id}/>
                                    </Flex>
                                </Box> : <Box textAlign="center">
                                    <Text fontSize="16" fontWeight="medium">
                                        No themes saved! <br/>
                                        <b>Get started with saving themes!</b>
                                    </Text>
                                </Box>
                        }
                        
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <div style={{top: 0, position: "relative", padding: 10}}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {user === null ? <LoginButton 
                        setUser={setUser}
                        setUserThemes={setUserThemes}
                    /> : 
                        <Flex direction="column">
                            <Box
                                fontSize="10"
                                bg="blackAlpha.400"
                                p="5"
                                borderRadius="md"
                            >
                        Logged in as: <br/>
                                {user.profile.email}
                            </Box>
                            <Button colorScheme="red" onClick={()=>setUser(null)}>
                            Log out
                            </Button>
                        </Flex>} 
                    <Flex direction="column">
                        <RegisterUserButton setUser={setUser} setUserThemes={setUserThemes}
                        />
                        <Spacer/>
                        {user !== null && <PostUserTheme 
                            ThemeFile={themeFile}
                            setPresets={setUserThemes}
                            user={user.id as string}
                        />
                        }
                    </Flex>
                </Grid>
            </div>
        </div>
    );
}