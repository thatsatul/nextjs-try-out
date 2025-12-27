import './test.css';

const BasicComponent = () => {
  return (
    <div className="driver-cards">
      {/* Repeat this .driver-card for each driver */}
      <div className="driver-card">
        <div className="driver-avatar">
          {/* Replace with image/avatar as needed */}
          <span className="avatar-icon" />
        </div>
        <div className="driver-info">
          <div><strong>Name:</strong> idrish khan</div>
          <div><strong>Mobile:</strong> 8079807980</div>
          <div><strong>Vehicle Number:</strong> KA02BCI480</div>
          <div className="driver-status active">Active</div>
        </div>
        <button className="more-actions">⋮</button>
      </div>
    </div>
  );
};

export default function TestPage() {
  return <BasicComponent />;
}
