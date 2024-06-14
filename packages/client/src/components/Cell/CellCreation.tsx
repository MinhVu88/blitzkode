import React from 'react';
import { useActions } from '../../hooks/useActions';
import './cellCreation.css';

interface CellCreationProps {
  previousCellId: string | null;
  forcedVisibility?: boolean;
}

const CellCreation: React.FC<CellCreationProps> = ({ previousCellId, forcedVisibility }) => {
  const { insertCellAfter } = useActions();

  return (
    <div className={`add-cell ${forcedVisibility && 'forced-visibility'}`}>
      <div className="add-buttons">
        <button 
          className='button is-rounded is-primary is-small' 
          onClick={() => insertCellAfter(previousCellId, 'code')}
        >
          <span className='icon is-small'>
            <i className='fas fa-plus'/>
          </span>
          <span>Code</span>
        </button>
        <button 
          className='button is-rounded is-primary is-small' 
          onClick={() => insertCellAfter(previousCellId, 'text')}
        >
          <span className='icon is-small'>
            <i className='fas fa-plus'/>
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className="line"></div>
    </div>
  );
};

export default CellCreation;
