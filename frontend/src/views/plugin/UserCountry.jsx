import React, { useEffect, useState } from "react";

function GetCurrentAddress() {
    const [add, setAdd] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(pos => {
             const { latitude, longitude } = pos.coords;

            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

            fetch(url)
                .then(res => res.json()) // Convert the response to JSON format.
                .then(data => setAdd(data.address)) // Set the 'add' state with the user's address information from the API response.
        });
    }, []); // The 'add' state variable now contains the user's current address information.

    return add;
}
export default GetCurrentAddress;