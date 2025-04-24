import '../../css/searchbar/searchbar.css'

export default function SearchBar(props){

    const { className, placeholder, handleChange, value } = props

    return(
        <div className='searchbar-container'>
            <input type="text" 
                className={className} 
                placeholder={placeholder} 
                onChange={handleChange}
                value={value}
            />
        </div>
    )
}