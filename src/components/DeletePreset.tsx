import { useDisclosure, Button, AlertDialog, AlertDialogOverlay,
    AlertDialogContent, AlertDialogHeader, 
    AlertDialogBody, AlertDialogFooter, Flex, Box, 
    Input, FormControl, FormLabel, Link } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useDragLayer, useDrop } from "react-dnd";
import { DroppedPreset, Preset } from "./Common";
import { ObjectId } from "bson";
import delete_preset from "../functions/delete_preset";
import fetch_presets from "../functions/fetch_presets";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import DeletePresetAlerts from "./DeletePresetAlerts";

/**
  * Provides the user a robust interface for deleting a preset from the presets list.
   *
   * @remarks
   * Component is a drop target. Also see ../functions/delete_preset.ts for backend.
   * ./DeleteUserPreset.tsx is the end user analog to this component. 
   *
   * @param setThemes - state function which sets the displayed presets.
   */

interface DeletePresetProps{
    setThemes: (x: Preset[]) => void;
}

export default function DeletePreset({setThemes}: DeletePresetProps){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement | null>(null);
    const [id, setId] = useState<ObjectId | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false); // submit button spinner
    const [apiKey, setApiKey] = useState<string>("");
    const [alertBuffer, setAlertBuffer] = useState<boolean>(false); // conditionally renders a success message.
                                                                    
    const [apiError, setApiError] = useState<boolean>(false); // alert logic

    const { isDragging, type } = useDragLayer((monitor) => ({
        isDragging: monitor.isDragging(),
        type: monitor.getItemType(),
    }));

    const [collectedProps, dropRef] = useDrop(() => ({
        accept: "PRESET",
        drop: (item, monitor) =>{
            const dropped = item as DroppedPreset;
            setId(dropped._id);
            onOpen();
        },
        collect: (monitor)=>({
            canDrop: monitor.canDrop() && monitor.isOver(),
        })
    })); 
    
    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => setApiKey(event.target.value);

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleSubmit(){
        setSubmitting(true);
        // eslint-disable-next-line
        delete_preset(apiKey, (id as ObjectId).toString())
            .then((result)=>{
                setApiError(false);
                fetch_presets(setThemes);
                setSubmitting(false);
                setAlertBuffer(true);
                sleep(3000)
                    .then((resolve) =>{
                        onClose();
                        setAlertBuffer(false);
                    });
            })
            .catch((error)=>{
                setApiError(true);
                console.error(error);
                setSubmitting(false);
            });
    }
    return (
        <>
            <Flex 
                role = "flex"
                bg='maroon'
                h="10vh"
                textAlign="center"
                borderRadius="md"
                justifyContent="center"
                borderColor={collectedProps.canDrop ? "red" : "white"}
                borderWidth="thin"
                direction="column"
                ref={dropRef}
                boxShadow={isDragging && type === "PRESET" ? 
                    collectedProps.canDrop ? "0 0 10px 5px rgba(255, 0, 0, 0.5)" 
                        : "0 0 10px 5px rgba(255, 255, 255, 0.5)" 
                    : "none"}
                p="7"
            >
              Drag a preset here to delete it!
            </Flex>
      
            <AlertDialog
                data-testid="deletePreset"
                isOpen={isOpen}
                motionPreset="slideInBottom"
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bgColor="blue.800">
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Delete theme:
                        </AlertDialogHeader>
      
                        {/* Conditionally render a confirmation message, or a success message */}
            
                        {!alertBuffer ? <Box>
                            <AlertDialogBody role = "AlertDialogBody">
                        Are you sure you want to delete this preset? This action is irreversible. <br/>
                                <Box p="4">
                                    <Box bg="blue.700" padding="3" borderRadius="10">
                                        <FormControl isRequired={apiKey===""}>
                                            <FormLabel fontSize="12">
                                                <Link href='https://www.mongodb.com/docs/atlas/app-services/authentication/api-key/' isExternal> 
                                            An API Key is required for this action: <ExternalLinkIcon mx='2px' />
                                                </Link>
                                            </FormLabel>
                                   
                                            <Input 
                                                type='password' 
                                                value={apiKey}
                                                onChange={handleApiKeyChange}
                                            />
                                        </FormControl>
                                    </Box>
                                </Box>
                            </AlertDialogBody>
      
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                                </Button>
                                <Button 
                                    colorScheme='red'
                                    isLoading={submitting}
                                    onClick={handleSubmit}
                                    ml={3}
                                    isDisabled={apiKey===""}
                                    role = "delButton"
                                >
                      Delete
                                </Button>
                            </AlertDialogFooter>
                        </Box>
                            :
                            <DeletePresetAlerts apiError={apiError}/>
                        }
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}