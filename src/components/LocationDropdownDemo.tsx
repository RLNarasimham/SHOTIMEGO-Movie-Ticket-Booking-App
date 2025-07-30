import React, { useState } from "react";

const locations = [
    { id: "hyd", name: "Hyderabad", state: "Telangana" },
    { id: "mum", name: "Mumbai", state: "Maharashtra" },
    { id: "del", name: "Delhi", state: "Delhi" },
];

export default function LocationDropdownDemo() {
    const [selected, setSelected] = useState(locations[0]);

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 justify-center items-center">
            <div className="relative">
                <div className="mb-2 font-bold text-xl text-black dark:text-white">Location Dropdown</div>
                <div className="absolute top-10 left-0 w-[320px] sm:w-[380px] min-w-[220px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-300 dark:border-gray-700 z-50">
                    {locations.map((loc) => (
                        <button
                            key={loc.id}
                            type="button"
                            onClick={() => setSelected(loc)}
                            className={`w-full px-4 py-3 text-left border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition 
                ${selected.id === loc.id ? "bg-red-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className={`font-medium ${selected.id === loc.id ? "text-red-700 font-semibold" : "text-gray-900 dark:text-white"}`}>
                                        {loc.name}
                                    </div>
                                    <div className={`text-sm ${selected.id === loc.id ? "text-red-600" : "text-gray-500 dark:text-gray-300"}`}>
                                        {loc.state}
                                    </div>
                                </div>
                                {selected.id === loc.id && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
