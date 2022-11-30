import "../styles/detail.css";

const BuildingDetail = (props) => {
  return (
    <div className="infos">
      <h2>{props.object.name}</h2>
    </div>
  );
};

export default BuildingDetail;
