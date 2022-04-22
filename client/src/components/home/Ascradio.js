const Ascradio = ({name}) => {

    // const handleChange = e => {
    //     handleFilters(e.target.value);
    // }
  

    return name.map((n) =>
    (
        <div key={n.id}  className="col-5">
            <input
			name="name_filter"
                type="radio"
                className="mr-2" />
            <label className="form-check-lable mr-4">{n.name}</label>
			
        </div>
    )) 
}

export default Ascradio;