import { useState } from "react";
import { fileUploadUtils } from "../utils/fileUploadUtils";

export default function FileUploadContainer() {
  const [file, setFile] = useState<File>();
  console.log(file);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files !== null) {
      console.log(e.target.files[0].size);
      const file = e.target.files[0];
      // Changing file state
      setFile(file);
    }
  }

  async function uploadFile() {
    if (file === undefined) {
      throw new Error("File not defined, cannot upload");
    }
    await fileUploadUtils.uploadFileToS3(file);
  }
  return (
    <div className="App">
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}
