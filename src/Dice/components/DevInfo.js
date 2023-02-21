import React, { useCallback, useState } from 'react';
import './index.css';

const DevInfo = React.memo(() => {
    const [logger, setLogger] = useState([]);
    const pushLogger = useCallback((log) => setLogger(logger => logger.push(log)), [setLogger]);

    const _console = {
        log: console.log
    };
    console.log = (info) => {
        window.alert(info);
        _console.log(info);
        pushLogger(info);
    }

    return (
        <div className='devInfo'>
            {
                logger.map(log => {
                    return (
                        <span>{log}</span>
                    )
                })
            }
        </div>
    )
});

export default DevInfo;