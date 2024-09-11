import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, Image, MenuItem } from "@chakra-ui/react";
import { MODELS } from "shared/enums/models";
import { selectedModelAtom } from "../state/selectedModel";
import { useAtom } from "jotai";
import anthropic_logo from "../assets/models/anthropic_logo.png";
import mistral_logo from "../assets/models/mistral_logo.png";
import openai_logo from "../assets/models/openai_logo.png";
import { Fragment } from "react/jsx-runtime";
import { appStateAtom } from "../state/app";

export function ChatModelSelector() {
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
  const [, setAppState] = useAtom(appStateAtom);

  const logos: Record<string, string> = {
    OpenAI: openai_logo,
    Mistral: mistral_logo,
    Anthropic: anthropic_logo,
  };

  function renderModelList() {
    const keys = Object.keys(MODELS);
    const modelList = keys.map((key) => {
      return (
        <Fragment key={key}>
          <div className="chat-model-source-menu">
            <p style={{ display: "inline-block" }}>
              <Image className="chat-model-logo" src={logos[key]} object-fit="scale-down" />
              {key}
            </p>
          </div>
          {renderSourceList(key)}
        </Fragment>
      );
    });
    return modelList;
  }

  function renderSourceList(key: string) {
    const entries = MODELS[key];
    const sourceList = entries.map((entry, index) => {
      return (
        <MenuItem
          key={`${entry.model}_${index}`}
          onClick={() => {
            console.log("selecting model");
            setAppState("loading");
            setSelectedModel(entry);
          }}>
          {entry.display_name}
        </MenuItem>
      );
    });
    return sourceList;
  }
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {selectedModel ? selectedModel.display_name : "AI Models"}
      </MenuButton>
      <MenuList>{renderModelList()}</MenuList>
    </Menu>
  );
}
