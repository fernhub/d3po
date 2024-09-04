import { ArrowRightIcon } from "@chakra-ui/icons";
import { Card, CardBody, Tooltip } from "@chakra-ui/react";
import { type Document } from "shared/schema/document";
type TileProps = {
  document: Document;
};
export function DocumentTile({ document }: TileProps) {
  return (
    <Card
      id={document.s3_key}
      className="document-tile"
      direction={{ base: "column", sm: "row" }}
      overflow="hidden">
      <CardBody>
        {document.name}
        <Tooltip label="Open document">
          <button className="open-document-button">
            <ArrowRightIcon />
          </button>
        </Tooltip>
      </CardBody>
    </Card>
  );
}
