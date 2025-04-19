import '../../css/searchbar/searchbar.css'

export default function SearchBar(props){

    const { className, placeholder, handleChange } = props

    return(
        <div className='searchbar-container'>
            <input type="search" 
            className={className} 
            placeholder={placeholder} 
            onChange={handleChange}/>
        </div>
    )
}