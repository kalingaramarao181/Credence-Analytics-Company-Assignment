import { useState, useEffect } from "react"
import axios from "axios";
import Popup from 'reactjs-popup';
import './App.css';


function App() {
  const [data, setData] = useState([])
  const [movieData, setMovieData] = useState({})
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false)
  const [addFormData, setAddFormData] = useState({})
  const [isOpenAddForm, setIsOpenAddForm] = useState(false)

  
  useEffect(() => {
    axios.get("http://localhost:3001/movies")
      .then(res => {
        setData(res.data)
      }).catch(err => {
        console.log(err);
      })
  }, [])


  const handileAddInput = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value })
  }
  const handileAddInputFile = (e) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.files[0] })
  }

  //NEW FORM ADDING
  const handileSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    Object.entries(addFormData).forEach(([key, value]) => {
      formData.append(key, value)
    });

    try {
      await axios.post('http://localhost:3001/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Application submitted successfully');
      window.location.reload()
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  }

  //UPDATE 
  const handileUpdate = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    Object.entries(addFormData).forEach(([key, value]) => {
      formData.append(key, value)
    });

    const id = addFormData.id
    try {
      await axios.put('http://localhost:3001/movies/' + id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Application submitted successfully');
      window.location.reload()
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  }

  //DELETE MOVIE
  const onClickDelete = (id) => {
    axios.delete("http://localhost:3001/movies/" + id)
      .then(res => {
        alert("Movie Deleted Successfully")
      })
      .catch(err => {
        console.log(err);
      })
  }

  //ADD FORM POPUP
  const addForm = () => {
    return (
      <Popup
        open={isOpenAddForm}
        onClose={() => setIsOpenAddForm(false)}
        closeOnDocumentClick
        contentStyle={{
          width: "25vw",
          padding: '3.5vw',
          borderRadius: '10px',
          boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
          transition: 'opacity 0.5s ease-in-out', // Transition effect for opacity
          backgroundColor: "white",
          height: "30vh",
        }}
      >
        {close => (
          <form onSubmit={handileSubmit} className="form-container">
            <input name="name" onChange={handileAddInput} className="form-input" type="text" required />
            <input name="img" onChange={handileAddInputFile} className="form-input" type="file" required />
            <textarea name="summary" onChange={handileAddInput} className="form-textarea" type="text" cols={30} rows={4} required />
            <div>
              <button type="submit" className="update-button">Submit</button>
              <button type="button" onClick={() => setIsOpenAddForm(false)} className="cancel-button">Cancel</button>
            </div>
          </form>
        )}
      </Popup>
    )
  }

  //UPDATE FORM POPUP
  const updateForm = () => {
    return (
      <Popup
        open={isOpenUpdateForm}
        onClose={() => setIsOpenUpdateForm(false)}
        closeOnDocumentClick
        contentStyle={{
          width: "25vw",
          padding: '3.5vw',
          borderRadius: '10px',
          boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
          transition: 'opacity 0.5s ease-in-out', // Transition effect for opacity
          backgroundColor: "white",
          height: "30vh",
        }}
      >
        {close => (
          <form onSubmit={handileUpdate} className="form-container">
            <img className="paragraph-img" alt={"movie" + movieData.id} src={movieData.img} />
            <input name="img" onChange={handileAddInputFile} className="form-input" type="file" />
            <p className="paragraph">{movieData.name}</p>
            <input name="name" onChange={handileAddInput} className="form-input" type="text" />
            <p className="paragraph">{movieData.summary}</p>
            <textarea name="summary" onChange={handileAddInput} className="form-textarea" type="text" cols={30} rows={4} />
            <div>
              <button type="submit" className="update-button">Update</button>
              <button type="button" onClick={() => setIsOpenUpdateForm(false)} className="cancel-button">Cancel</button>
            </div>
          </form>
        )}
      </Popup>
    )
  }

  const onClickUpdate = async (id) => {
    try {
      const res = await axios.get("http://localhost:3001/movie/" + id);
      setAddFormData(res.data)
      setMovieData(res.data);
      setIsOpenUpdateForm(true);
      console.log(movieData);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="movies-container">
      <h1 className="movies-title">Movies</h1>
      <ul className="movies-list">
        {data.map((eachItem, index) => (
          <li className="movie-item">
            <div className="content-container">
              <img className="movie-image" src={eachItem.img} alt={`movie` + index} />
              <p className="movie-name">{eachItem.name}</p>
            </div>
            <p className="movie-summary">{eachItem.summary}</p>
            <div className="button-container">
              <button onClick={() => setIsOpenAddForm(true)} className="add-button">Add New</button>
              <button onClick={() => onClickUpdate(eachItem.id)} className="update-button">Update</button>
              <button className="delete-button" onClick={() => onClickDelete(eachItem.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {updateForm()}
      {addForm()}
    </div>
  );
}

export default App;
