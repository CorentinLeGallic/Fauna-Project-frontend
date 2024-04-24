import React, { useEffect } from 'react';

const Toast = React.memo(({ value }) => {

    useEffect(() => {
        console.log(value)
    }, [value])

    return (
        <li className='toast' id={value.id} style={{
            animation: "appear 0.5s forwards, disappear 0.5s " + (value.timeout - 500) + "ms forwards"
        }}>
            <img src={"./medias/" + value.icon + ".png"}></img>
            <span>{value.text}</span>
        </li>
    );
});

export default Toast;