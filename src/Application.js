import React, { useContext } from 'react';

import Grudges from './Grudges';
import NewGrudge from './NewGrudge';
import { GrudgeContext } from './GrudgeContext';

const Application = () => {

  const { isPast, isFuture, undo, redo } = useContext(GrudgeContext);

  return (
    <div className="Application">
      <NewGrudge />
      {isPast && <button onClick={() => undo()}>UNDO</button>}
      {isFuture && <button onClick={() => redo()}>REDO</button>}
      <Grudges />
    </div>
  );
};

export default Application;
