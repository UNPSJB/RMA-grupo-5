import { useRef, useState } from "react";
//import styles from "./CustomFileInput.module.css";
import React from "react";
import { Button } from "reactstrap";

export function CustomFileInput({ onChange, accept = "text/csv, application/json" }) {
    const styles = {dropZone: "", uploadedImage: ""}
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
      };

    const updateFile = (event) => {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setFile(file);
        onChange(event);
    }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };
      
    const handleFileDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            setFile(file);
        }
    };


    return (
        <div
          className={styles.dropZone}
          onDragOver={handleDragOver}
          onDrop={handleFileDrop}
          onClick={handleImageUploadClick}
          >
                Subir archivo
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              style={{ display: "none" }}
              onChange={updateFile}
            />

        </div>
    );

}