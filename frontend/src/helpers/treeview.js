import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const objectToFlatArray = (obj, prefix = '') => {
    const result = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                // Recurse into nested objects
                const nestedArray = objectToFlatArray(obj[key], newKey);
                result.push(...nestedArray);
            } else {
                // Push the current key-value pair to the result array
                result.push({ key: newKey, value: obj[key] });
            }
        }
    }

    return result;
}

const TreeNode = ({ data, idx }) => {
    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    //data = objectToFlatArray(data);
    if (typeof data !== 'object' && !Array.isArray(data)) {
        return (
            <ul className="list-group">
                <li className="list-group-item">
                    <div className='row'>
                        <span className="col-md-3"><strong>{idx}</strong></span>
                        <span className="col-md-9">: {data}</span>
                    </div>
                </li>
            </ul>
        )
    }

    return (
        <>
            <ul className="list-group">
                <li className="list-group-item" >
                    <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                        {!expanded ? <button className='btn btn-primary btn-sm'><FontAwesomeIcon icon={faPlus} /></button> : <button className='btn btn-primary btn-sm'><FontAwesomeIcon icon={faMinus} /></button>} 
                        &nbsp; <strong>{idx}</strong>
                    </span>
                </li>
                {/* {(data.constructor === Array || typeof data == 'object') ? <ul className="list-group"> : ''} */}
                {expanded &&
                    Object.entries(data).map(([key, value]) => (
                        <li key={key} className="list-group-item ps-5" >
                            {/* <strong>
                                {key}
                            </strong> */}
                            <TreeNode data={value} idx={key}/>
                        </li>
                    ))}
                {/* {(data.constructor === Array || typeof data == 'object') ? '</ul>' : ''} */}
            </ul>
        </>
    );
};

const Jsontreeview = ({ data }) => {
    console.log(data);
    return <TreeNode data={data} />;
};

export default Jsontreeview;
