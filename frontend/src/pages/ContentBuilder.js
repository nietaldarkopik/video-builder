import { Link, Outlet } from 'react-router-dom';
import React from 'react';
const sukukata =
  [
    ['v'],
    ['k'],
    ['v', 'k'],
    ['k', 'v'],
    ['k', 'v', 'k'],
    ['k', 'k', 'v'],
    ['k', 'k', 'v', 'k'],
    //['k', 'v', 'k', 'k'],
    //['k', 'k', 'k', 'v'],
    //['k', 'k', 'k', 'v', 'k'],
    //['k', 'k', 'v', 'k', 'k'],
    //['k', 'v', 'k', 'k', 'k']
  ];
const huruf_v = ['A', 'I', 'U', 'E', 'O'];
const huruf_k = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

const ContentBuilder = () => {
  const Showhuruf = (props) => {
    const prefix = props.prefix;
    const format = props.format;
    const idx = props.idx;
    let output = [];
    const form = format[idx]
    const cur = (form === 'k') ? huruf_k : huruf_v;
    console.log(prefix);

    output = cur.map((v,i) => {
      const sub = (format.length-1 > idx)?<Showhuruf idx={idx+1} format={format} prefix={prefix+v} key={prefix+i}/>:prefix+v;
      const br = (format.length-1 > idx)?'':<br/>
      return (<>{sub}{br}</>)
    })
    return output
  }

  return (

    <div>
      {sukukata.map((v, i) => {
        return (
          <>
            <h1>{v}</h1>
            <Showhuruf format={v} prefix='' idx={0} key={i}/>
          </>
        )
      })}
    </div>
  );
};

export default ContentBuilder;
