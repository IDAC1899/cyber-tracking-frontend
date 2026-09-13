// src/components/ConfirmDelete/ConfirmDelete.jsx

const ConfirmDelete = ({ itemName, onConfirm, onCancel }) => {
  return (
    <div className='confirm-delete-overlay'>
      <div className='confirm-delete-box'>
        <p>Are you sure you want to delete {itemName ? `"${itemName}"` : 'this item'}?</p>
        <div className='confirm-delete-actions'>
          <button onClick={onConfirm} className='btn btn-danger'>Yes, delete</button>
          <button onClick={onCancel} className='btn btn-link'>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;