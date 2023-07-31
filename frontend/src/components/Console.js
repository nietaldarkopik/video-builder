import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PostData, fetchDataGet, fetchDataPost } from '../configs/Server';
import { redirect, useNavigate } from 'react-router-dom'

const Table = (props, responsive) => {
    responsive = (!responsive) ? true : responsive;
    //const [dataArray, setDataArray] = useState(false);
    const data = props;
    let mappedArray = (!data) ? '' : objectToArray(data);
    let out = [];

    if (typeof data == 'object') {
        out = Object.entries(data).map((v, i) => {
            const p = { key: i, value: JSON.stringify(v[1]) };
            return Tr(p);
        })
    } else if (Array.isArray(mappedArray)) {
        out = mappedArray.map((v, t) => {
            if (Array.isArray(v)) {
                //console.log('Ini TR Array', v);
                return Tr(v);
                /* 
                return v.map((v2,i2) => {
                    return Tr({key: i2, value: v2});
                }); */
            } else if (typeof v == 'object') {
                //dt = JSON.stringify(v, null, 2)
                //dt = objectToArray(v);
                /* index = Object.keys(v).map((k) => {
                    return k
                }); */
                /* dt = Object.entries(v).map((v,i) => {
                    return v[1];
                });
                dt = valIsArray(dt[0]); */
                return Table(v, false);
            } else {
                return (<tr><td>{t}</td><td>{v}</td></tr>);
            }
        });
    }
    const responsiveOpen = (responsive) ? ({ __html: '<div className="table-responsive">' }) : '';
    const responsiveClose = (responsive) ? ({ __html: '</div>' }) : '';
    return (
        <>
            {/* {responsiveOpen} */}
            <table className="table table-primary">
                <thead>
                    <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Data</th>
                    </tr>
                </thead>
                <tbody>
                    {out}
                </tbody>
            </table>
            {/* {responsiveClose} */}
        </>
    )
}


export const FormatVideo = (props) => {
    const navigate = useNavigate();
    //console.log('props',props);
        
    const handleDownloadFormat = async (configs) => {
        const attributes = configs.target.attributes;
        const properties = {}
        Array.from(attributes).map((v, i) => {
            properties[v.name] = v.value;
        })

        const params = {
            body: JSON.stringify(properties)
        };

        const out = await fetchDataPost(params, 'file/download').then((response) => {
            console.log(response);
            return response;
        });
        const path = out.path;
        return navigate('/video-builder?path='+path,{state: out});
        //return out;
    }


    const data = props.data;
    const formatList = (!data.formats) ? [] : data.formats;
    const videoDetails = (!data.videoDetails) ? {} : data.videoDetails;
    return (
        <>
            <h1>Format Videos</h1>
            <div className="list-group">
                {formatList.map((val, i) => {
                    const v = val;
                    return (
                        <div className="list-group-item list-group-item-action" aria-current="true">
                            <button type="button" className="btn w-100 btn-warning" aria-current="true" {...v} videodetails={JSON.stringify(videoDetails)} onClick={(e) => { handleDownloadFormat(e) }}>
                                Mime : {v.mimeType} - WxH: {v.width} x {v.height} - Quality : {v.quality} - Quality Label : {v.qualityLabel} - Video: {v.hasVideo ? 'true' : 'false'} - Audio : {v.hasAudio ? 'true' : 'false'}
                            </button>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
const Tr = (props) => {
    const key = props.key || '';
    const value = props.value || '';

    const data = props;
    let mappedArray = [];

    if (Array.isArray(data)) {
        mappedArray = data;
    } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        mappedArray = Object.entries(data).map((val, key) => {
            return val[1];
        });
    }

    return (
        <>
            {mappedArray.map((v, i) => {
                v = (!JSON.parse(v)) ? v : JSON.parse(v);

                //console.log(v);
                //console.log(typeof v, typeof i, Array.isArray(v))

                if (i == 0) {
                    return (<></>)
                } else {
                    if (typeof v == 'object' || Array.isArray(v)) {
                        if (typeof v == 'object') {
                            const vo = Object.entries(v).map((v2, i2) => {
                                let index = (typeof v2 == 'object') ? v2[0] : i2;
                                let val = (typeof v2 == 'object') ? v2[1] : v2;
                                val = (typeof val == 'object') ? JSON.stringify(val) : val;

                                return (
                                    <tr>
                                        <td>{index}</td>
                                        <td>{val}</td>
                                    </tr>
                                )
                            })
                            return (<>{vo}</>)
                        }
                        if (Array.isArray(v)) {
                            const vo = v.map((v2, i2) => {
                                return (
                                    <tr>
                                        <td>{i2}</td>
                                        <td>{v2}</td>
                                    </tr>
                                )
                            })
                            return (<>{vo}</>)
                        }
                    } else {
                        return (
                            <tr>
                                <td>{i}</td>
                                <td>{v}</td>
                            </tr>
                        )
                    }
                }
            })}
        </>
    )
}
const valIsArray = (val) => {

    if (Array.isArray(val)) {
        return (
            <Table {...val} />
        )
    } else if (typeof val == 'object') {
        /* const mappedArray = Object.entries(val).map((key) => {
            if (isNaN(key[0])) {
                return { [key[0]]: key[1] };
            } else {
                return key[1];
            }
        }); */
        return (
            <Accordion {...val} />
        )
    } else {
        return <>{val}</>;
    }
}

const objectToArray = (val) => {
    if (Array.isArray(val)) {
        return val;
    } else if (typeof val == 'object') {
        const mappedArray = Object.values(val).map((key) => {
            return key;
        });
        return mappedArray
    } else {
        return val;
    }
}

const Accordion = (props) => {
    const data = props;
    const uniq = uuidv4();
    let mappedArray = [];

    if (Array.isArray(data)) {
        mappedArray = data;
    } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        mappedArray = Object.entries(data).map((key) => {
            return { [key[0]]: key[1] };
        });
    }

    return (
        <div>
            <div className="accordion accordion-flush" id={'accordionConsole'}>
                {mappedArray.map((v, t) => {
                    const key = Object.keys(v).map((k) => { return k });
                    const value = Object.values(v).map((val) => { return val });
                    const out = valIsArray(value[0]);
                    return (
                        <div className="accordion-item">
                            <h2 className="accordion-header" id={'flush-headingOne' + key + uniq}>
                                <button className="accordion-button btn-primary btn bg-primary text-warning" type="button" data-bs-toggle="collapse" data-bs-target={'#flush-collapseOne' + key + uniq} aria-expanded="false" aria-controls={'flush-headingOne' + key + uniq}>
                                    {key}
                                </button>
                            </h2>
                            <div id={'flush-collapseOne' + key + uniq} className="accordion-collapse collapse" aria-labelledby={'flush-headingOne' + key + uniq} data-bs-parent={'#accordionConsole'}>
                                <div className="accordion-body pe-0 table-responsive" style={{ maxHeight: 400 }}>
                                    {/* {JSON.stringify(v)} */}
                                    {out}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const ConsoleJson = (props) => {
    const data = props.data;
    let mappedArray = [];

    if (Array.isArray(data)) {
        mappedArray = data;
    } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        mappedArray = Object.entries(data).map((key) => {
            return { [key[0]]: key[1] };
        });
    }

    return (
        <>
            {mappedArray.map((v, t) => {
                return (<Accordion {...v} key={t} />)
            })}
        </>
    );
};

export default ConsoleJson;