export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  handleCancel,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter</div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary</div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value</div>
          <div> {value} </div>
        </li>
        <div
            className="button"
            id={address + "-approve"}
            onClick={(e) => {
              e.preventDefault();

              handleApprove();
            }}
        >
          Approve
        </div>
        <div
            className="button"
            id={address + "-cancel"}
            onClick={(e) => {
              e.preventDefault();

              handleCancel();
            }}
        >
          Cancel
        </div>
      </ul>
    </div>
  );
}
