import React, {useEffect, useRef, useState} from 'react'
import { Images } from 'lucide-react';

function ImageUpload({onChange, imageFile}) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState({
        "type":"",
        "value":""
    });
    const inputRef = useRef(null);

    useEffect(() => {
        if(imageFile){
            setPreview({
                "type":"server",
                "value":imageFile
            });
        } else {
            setPreview({
                "type":"",
                "value":"",
            });
        }
    },[imageFile])

    const handleFile = (file) => {
        if (!file) return;

        // Validasi tipe
        if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar!");
        return;
        }

        // Validasi size (2MB)
        if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran maksimal 2MB");
        return;
        }

        const url = URL.createObjectURL(file);
        setPreview({
            "type":"blob",
            "value" : url
        });

        onChange(file); 
    };

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    }

    const handleOnDrag = (e) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = (e) => {
        setIsDragging(false);
    }

    const handleDrop = (e) => {
        console.log(e);
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const getImageSrc = () => {
        console.log("preview:", preview);

        if(preview.type == "blob"){
            return preview;
        }

        return `http://localhost:5000/api/uploads/${preview}`
    }

    useEffect(() => {
        console.log(preview);
        return () => {
            if(preview) URL.revokeObjectURL(preview);
        }
    },[preview])
    

  return (
        <>
            <div 
            className={`w-full h-auto aspect-square hover:cursor-pointer border border-gray-500 flex justify-center items-center rounded-md ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
            onClick={() => inputRef.current.click()}
            onDragOver={handleOnDrag}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            >
                <div className="flex flex-col justify-center items-center gap-2">
                    {
                       
                        preview.value !== "" ? (
                            <img 
                                src={preview.type == "blob"? preview.value : `http://localhost:5000/api/uploads/${preview.value}`}
                                alt="Preview"
                                className='w-full h-auto object-cover rounded-lg aspect-square'
                            />
                        ) : (
                            <>
                                <Images color="rgb(107 114 128 / var(--tw-border-opacity, 1)" width={30} height={30}/>
                                <p className="text-gray-500">No picture</p>
                            </>
                        )
                    }
                </div>
            </div>
            <input
            hidden
            type="file"
            ref={inputRef}
            accept="image/png, image/jpeg"
            onChange={handleInputChange}
            className="mb-3 w-full"
            />
        </>
        
  )
}

export default ImageUpload