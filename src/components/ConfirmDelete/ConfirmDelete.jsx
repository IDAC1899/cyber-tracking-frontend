// src/components/ConfirmDelete/ConfirmDelete.jsx

const ConfirmDelete = ({ itemName, onConfirm, onCancel }) => {
  return (
    <div className='confirm-delete-overlay'>
      <div className='confirm-delete-box'>
        <div className='confirm-delete-icon'>
          <i className='ti ti-alert-triangle' aria-hidden='true'></i>
        </div>
        <p>Are you sure you want to delete "{itemName}"?</p>
        <div className='confirm-delete-actions'>
          <button className='btn btn-danger' onClick={onConfirm}>
            Delete
          </button>
          <button className='btn btn-link' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;