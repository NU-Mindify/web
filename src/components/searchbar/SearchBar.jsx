import './searchbar.css'

export default function SearchBar(props){

    return(
       <input type="search" 
       className="search" 
       placeholder={props.placeholder} 
       onChange={props.handleChange}/>
    )
}