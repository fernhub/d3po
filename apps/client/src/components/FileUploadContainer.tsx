import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["PDF"];

export default function FileUploadContainer() {
  const [file, setFile] = useState<File>();
  console.log(file);
  return (
    <div className="file_drop_container">
      <FileUploader
        handleChange={setFile}
        multiple={false}
        classes="file_drop_area"
        name="file"
        types={fileTypes}
      />
    </div>
  );
}
