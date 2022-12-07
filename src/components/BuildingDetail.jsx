import "../styles/detail.css";

const BuildingDetail = (props) => {
  return (
    <>
      <div className="infos">
        <h2>{props.object.name}</h2>
        <p>{props.object.description}</p>
        {props.object.collection && (
          <p>
            <b>Collection: </b>
            {props.object.collection}
          </p>
        )}
        {props.object.supply && (
          <p>
            <b>Supply: </b>
            {props.object.supply}
          </p>
        )}
        {props.object.jobs && (
          <>
            <h3>Building Jobs:</h3>
            <p className="classic">Classic {props.object.jobs[0]}</p>
            <p className="legendary">Legendary {props.object.jobs[1]}</p>
          </>
        )}
      </div>
      <img
        className="poster"
        src={"./assets/" + props.object.name + ".jpg"}
        width={432}
        height={540}
        alt="poster"
      />
    </>
  );
};

export default BuildingDetail;
