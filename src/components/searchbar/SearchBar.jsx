import '../../css/searchbar/searchbar.css'

export default function SearchBar(props){

    return(
        <div className='searchbar-container'>
            <input type="search" 
            className="search" 
            placeholder={props.placeholder} 
            onChange={props.handleChange}/>
        </div>
    )
}