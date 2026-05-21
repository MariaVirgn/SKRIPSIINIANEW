import React, {useEffect, useState} from "react";
import {Images} from "lucide-react" ;
import ImageUpload from "./ImageUpload";

export default function ProductModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({});
  const [accords, setAccords] = useState([""]);
  const [moods, setMoods] = useState([""]);
  const [topNotes, setTopNotes] = useState([""]);
  const [midNotes, setMidNotes] = useState([""]);
  const [baseNotes, setBaseNotes] = useState([""]);
  console.log("initialData : ", initialData);

  useEffect(() => {
    if(initialData) {
        setForm(initialData);
        setAccords(initialData.Accord.split(" "));
        setMoods(initialData.Mood.split(" "));
        setTopNotes(initialData.top_notes.split(" "));
        setMidNotes(initialData.mid_notes.split(" "));
        setBaseNotes(initialData.base_notes.split(" "));
    }else {
        setForm({
            "perfume":"",
            "brand":"",
            "price":"",
            "size":"",
            "Accord":"",
            "Mood":"",
            "top_notes":"",
            "base_notes":"",
            "mid_notes":"",
            "concentrate":"",
            "Occation":"",
            "situation":"",
            "Range":"",
            "combined_text":"",
            "image_file": ""
        });
        setAccords([""]);
        setMoods([""]);
        setTopNotes([""]);
        setMidNotes([""]);
        setBaseNotes([""]);
    }
  },[initialData])

  const handleAddFields = (field) => {
    if(field == "accords"){
        setAccords([...accords, ""]);
    }

    if(field == "mood"){
        setMoods([...moods, ""]);
    }

    if(field == "topNotes"){
        setTopNotes([...topNotes, ""]);
    }

    if(field == "midNotes"){
        setMidNotes([...midNotes, ""]);
    }

    if(field == "baseNotes"){
        setBaseNotes([...baseNotes, ""]);
    }
  }

  const ImageChange = (file) => {
    setForm({...form,image:file})
  }

  const handleChange = (field, index, value) => {
    if(field == "accords"){
        let updated = [...accords];
        updated[index] = value;
        setAccords(updated);
        updated = updated.filter(item => item != "");
        setForm({...form, Accord: updated.toString().replace(",", " ")})
    }
    
    if(field == "mood") {
        let updated = [...moods];
        updated[index] = value;
        setMoods(updated);
        updated = updated.filter(item => item != "");
        setForm({...form, Mood: updated.toString().replace(","," ")})
    }
    
    if(field == "topNotes"){
        let updated = [...topNotes];
        updated[index] = value;
        setTopNotes(updated);
        updated = updated.filter(item => item != "");
        setForm({...form, top_notes: updated.toString().replace(","," ")})
        
    }
    
    if(field == "midNotes"){
        let updated = [...midNotes];
        updated[index] = value;
        setMidNotes(updated);
        updated = updated.filter(item => item != "");
        setForm({...form, mid_notes: updated.toString().replace(","," ")})
        
    }
    
    if(field == "baseNotes"){
        let updated = [...baseNotes];
        updated[index] = value;
        setBaseNotes(updated);
        updated = updated.filter(item => item != "");
        setForm({...form, base_notes: updated.toString().replace(","," ")})
    }
  }

  useEffect(() => {
    console.log(form);
  },[form])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-[800px]">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Product" : "Add Product"}
        </h2>
        
        <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1">
                <ImageUpload onChange={ImageChange} imageFile={form.image_file}/> 
            </div>
            <div className="col-span-2 flex flex-col gap-2">
                <div className="flex gap-2">
                    <div className="">
                        <label htmlFor="perfumeName" className="text-sm">Name :</label>
                        <input
                        placeholder="Perfume Name"
                        value={form.perfume || ""}
                        onChange={(e) =>
                            setForm({ ...form, perfume: e.target.value })
                        }
                        name="perfumeName"
                        className="w-full border rounded-md p-2 mb-3 bg-white"
                        />
                    </div>

                    <div className="">
                        <label htmlFor="perfumeBrand" className="text-sm">Brand :</label>
                        <input
                        placeholder="Brand"
                        value={form.brand || ""}
                        onChange={(e) =>
                            setForm({ ...form, brand: e.target.value })
                        }
                        name="perfumeBrand"
                        className="w-full border p-2 mb-3 bg-white rounded-md "
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 px-[1px] ">
                    <div className="flex flex-col gap-2 w-full">
                        <label htmlFor="accords" className="text-sm">Accord:</label>
                        <div className="max-h-[50px] w-auto overflow-y-auto gap-2 flex flex-col">
                            {
                                accords.map((val, index) => {
                                    return (
                                        <input className="bg-white border p-2 text-md w-full" placeholder={"accord ke-"+(index+1)} value={val} onChange={(val) => handleChange("accords", index, val.target.value)}/>
                                    )
                                })
                            }
                        </div>
                        <button 
                            className="text-white text-xs bg-blue-500 block w-full rounded-md"
                            onClick={() => handleAddFields("accords")}
                        >
                            + Tambah 
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="mood" className="text-sm">Mood:</label>
                        <div className="max-h-[50px] w-auto overflow-y-auto gap-2 flex flex-col">
                            {
                                moods.map((val, index) => {
                                    return (
                                        <input key={index} className="bg-white border p-2 text-md w-full" placeholder={"mood ke-"+(index+1)} value={val} onChange={(val) => handleChange("mood",index, val.target.value)}/>
                                    )
                                })
                            } 
                        </div>
                        <button className="text-white text-xs bg-blue-500 block w-full rounded-md" onClick={() => handleAddFields("mood")}> 
                            + Tambah 
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="topNotes" className="text-sm">top_notes:</label>
                        <div className="max-h-[50px] w-auto overflow-y-auto gap-2 flex flex-col">
                            {
                                topNotes.map((val, index) => {
                                    return (
                                        <input className="bg-white border p-2 text-md w-full" placeholder={"top_notes ke-"+(index+1)} value={val} onChange={(val) => handleChange("topNotes",index, val.target.value)}/>
                                    )
                                })
                            }
                        </div>
                        <button className="text-white text-xs bg-blue-500 block w-full rounded-md" onClick={() => handleAddFields("topNotes")}> 
                            + Tambah 
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="midNotes" className="text-sm">mid_notes:</label>
                        <div className="max-h-[50px] w-auto overflow-y-auto gap-2 flex flex-col">
                            {
                                midNotes.map((val, index) => {
                                    return (
                                        <input className="bg-white border p-2 text-md w-full" placeholder={"mid_notes ke-"+(index+1)} value={val} onChange={(val) => handleChange("midNotes",index, val.target.value)}/>
                                    )
                                })
                            }
                        </div>
                        <button className="text-white text-xs bg-blue-500 block w-full rounded-md" onClick={() => handleAddFields("midNotes")}> 
                            + Tambah 
                        </button>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="baseNotes" className="text-sm">base_notes:</label>
                        <div className="max-h-[50px] w-auto overflow-y-auto gap-2 flex flex-col">
                            {
                                baseNotes.map((val, index) => {
                                    return (
                                        <input className="bg-white border p-2 text-md w-full" placeholder={"base_notes ke-"+(index+1)} value={val} onChange={(val) => handleChange("baseNotes",index, val.target.value)}/>
                                    )
                                })
                            }
                        </div>
                        <button className="text-white text-xs bg-blue-500 block w-full rounded-md" onClick={() => handleAddFields("baseNotes")}> 
                            + Tambah 
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="perfumeBrand" className="text-sm">Gender :</label>
                        <select value={form.gender} name="" id="" className="p-2 rounded-md bg-white border" onChange={(e) => setForm({...form, "gender":e.target.value})}>
                            <option value="unknown">-- silakan pilih ---</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="perfumeBrand" className="text-sm">Range :</label>
                        <select value={form.Range} name="" id="" className="p-2 rounded-md bg-white border" onChange={(e) => setForm({...form, "Range":e.target.value})}>
                            <option value="unknown">--- silakan pilih ---</option>
                            <option value="premium">Premium</option>
                            <option value="classic">Classic</option>
                            <option value="luxury">Luxury</option>
                            <option value="basic">Basic</option>
                            <option value="elite">Elite</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="perfumeBrand" className="text-sm">Situation :</label>
                        <select value={form.situation} name="" id="" className="p-2 rounded-md bg-white border" onChange={(e) => setForm({...form, "situation":e.target.value})}>
                            <option value="unknown">--- silakan pilih ---</option>
                            <option value="day">Day</option>
                            <option value="night">Night</option>
                            <option value="versatile">Versatile</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="perfumeBrand" className="text-sm">Occasion :</label>
                        <select value={form.Occasion} name="" id="" className="p-2 rounded-md bg-white border" onChange={(e) => setForm({...form, "Occasion":e.target.value})}>
                            <option value="unknown">--- silakan pilih ---</option>
                            <option value="daily">daily</option>
                            <option value="night out">night out</option>
                            <option value="formal event">formal event</option>
                            <option value="outdoor">outdoor</option>
                            <option value="relaxing">relaxing</option>
                            <option value="casual day">casual day</option>
                            <option value="office">office</option>
                            <option value="daily outdoor">daily outdoor</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="perfumeBrand" className="text-sm">Concentrate :</label>
                        <select value={form.concentrate} name="" id="" className="p-2 rounded-md bg-white border" onChange={(e) => setForm({...form, "concentrate":e.target.value})}>
                            <option value="unknown">--- silakan pilih ---</option>
                            <option value="xdp">xdp</option>
                            <option value="edp">edp</option>
                            <option value="edt">edt</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label htmlFor="perfumeBrand" className="text-sm">Size :</label>
                        <input
                        placeholder="Size"
                        type="number"
                        value={form.size || ""}
                        onChange={(e) =>
                            setForm({ ...form, "size": e.target.value })
                        }
                        className="w-full border p-2 mb-3 bg-white"
                        />
                    </div>

                    <div>
                        <label htmlFor="perfumeBrand" className="text-sm">Price :</label>
                        <input
                        placeholder="Price"
                        type="number"
                        value={form.price || ""}
                        onChange={(e) =>
                            setForm({ ...form, price: e.target.value })
                        }
                        className="w-full border p-2 mb-3 bg-white"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="text-black"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(form, initialData? true:false)}
            className="bg-black text-white px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}