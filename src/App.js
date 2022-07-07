// import './App.css';
import './App.css';
import axios from 'axios';
import React from 'react';
import { Component, useEffect, useState } from 'react';
// // reactstrap
import { Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import moment from "moment";
import './App.css';

function App() {
  let url = "https://registro-exp.herokuapp.com"

  // --------------------------------------------------------------
  // login ---------------------------------------------------------------
  const [bodyParameters, setBodyParameters] = useState({
    email: "",
    password: ""
  });
  const [isLog, setIsLog] = useState(false);

  const handleChangeBodyParameters = (e) => {
    setBodyParameters({
      ...bodyParameters,
      [e.target.name]: e.target.value
    })
  }

  const requestLogin = (bodyParm) => {
    const body = bodyParm;
    axios.post(url + "/auth/login", body)
      .then(response => { 
        setIsLog(true)
        localStorage.setItem("userToken", JSON.stringify(response.data.access_Token));
        setAuthToken("Bearer " + JSON.parse(localStorage.getItem("userToken")))
        requestGet();
      })
  }

  function setAuthToken(token) {
    axios.defaults.headers.common['Authorization'] = '';
    delete axios.defaults.headers.common['Authorization'];
    if (token) {
      axios.defaults.headers.common['Authorization'] = `${token}`;
    }
  }

  const [modalLogin, setmodalLogin] = useState(false);


  const updateEstadeModalLogin = () => {
    if (modalLogin === false) {
      setTimeout(async function () {
        setmodalLogin(true);
      }, 300)
    } else {
      setmodalLogin(false)
    }
  }

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    axios.defaults.headers.common['Authorization'] = ""
    setIsLog(false)
  }

  const [modalLogout, setmodalLogout] = useState(false);


  const updateEstadeModalLogout = () => {
    if (modalLogout === false) {
      setTimeout(async function () {
        setmodalLogout(true);
      }, 300)
    } else {
      setmodalLogout(false)
    }
  }

  // get general que siempre traera los cambios y cuando se inicia la web
  const [getFiles, setGetFiles] = useState([]); 
  const [prevPath, setPrevPath] = useState([]);
  const [nextPath, setNextPath] = useState([]);
 

  const [desc, setDescription] = useState({
    description: ""
  });
  const handleChangeDescription = (e) => {
    setDescription({
      ...desc,
      [e.target.name]: e.target.value
    })
  }

  // desc? url + "/file?descr=0"  :
  const requestGet = async (page) => {
    await axios.post(page ? page : url + "/file?page=0")
      .then(response => {
        setPrevPath(response.data.prevPath ? url + response.data.prevPath : null);
        setNextPath(response.data.nextPath ? url + response.data.nextPath : null);        
        setGetFiles(response.data.content);
      }).catch(error => {
        console.log(error)
      })
  }
  const requestGetdescr = async (page) => {
    await axios.post(page ? page : url + "/file?descr=0", desc)
      .then(response => {
        setPrevPath(response.data.prevPath ? url + response.data.prevPath : null);
        setNextPath(response.data.nextPath ? url + response.data.nextPath : null);
        setGetFiles(response.data.content);
      }).catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    desc.description
      ? setTimeout(async function () {
        requestGetdescr()
      }, 500)
      : requestGet()
  }, []);

  // get by id
  const [file, setFile] = useState({
    id: "",
    numberFile: "",
    title: "",
    expirationDate: "",
    creationDate: ""
  });
  const handleModifFile = (f) => {
    setFile({
      ...file,
      [f.target.name]: f.target.value
    })
  }

  const reguestGetById = (id) => {
    axios.get(url + "/file/" + id)
      .then(response => {
        setFile(response.data)
      }).catch(error => {
        console.log(error)
      })
  }
  // -----------------------------
  // modal editar y eliminar


  const [modalEdit, setModalEdit] = useState(false);

  const updateModalEdit = () => {
    if (modalEdit === false) {
      setTimeout(async function () {
        setModalEdit(true);
      }, 500)
    } else {
      setModalEdit(false)

    }
  }

  const requestPut = async (id, file) => {
    const newFile = file;
    await axios.put(url + "/file/" + id, newFile).then(response => {
      // console.log(response.data);
      requestGet();
    })
  }

  // req delet  

  const [modalDelete, setModalDelete] = useState(false);

  const modifModalDelete = () => {
    if (modalDelete === false) {
      setModalDelete(true)
    } else {
      setModalDelete(false)

    }
  }

  const requestDeleteById = (id) => {
    axios.delete(url + "/file/" + id)
      .then(response => {
        modifModalDelete()
        requestGet();
      }).catch(error => {
        console.log(error);
      })
  };

  // req post
  const [modalAdd, setModalAdd] = useState(false);

  const modifModalAdd = () => {
    if (modalAdd === false) {
      setModalAdd(true)
    } else {
      setModalAdd(false)
    }
  }
  const requestPost = async (file) => {
    const newFile = file;
    await axios.post(url + "/file/create", newFile)
      .then(response => {
        modifModalAdd()
        requestGet();
      });
  };
  // -------------------------------------------------------------
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        {isLog
          ? <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => { updateEstadeModalLogout() }}>Salir</button>
          : <button className="btn btn-outline-success my-2 my-sm-0" onClick={() => { updateEstadeModalLogin() }}>Ingresar Usuario</button>
        }


        <button className="navbar-toggler" type="button" data-toggle="collapse"
          data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
          aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        {isLog
          ?
          <div className="collapse navbar-collapse" id="navbarSupportedContent">

            <input className="form-control description" type="description" name="description" id="description" defaultValue={desc.description} placeholder="Buscar por numero expte, caratula o año de vencimiento"
              onChange={(a) => handleChangeDescription(a)} />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={() => { desc.description ? requestGetdescr() : requestGet() }}>Buscar</button>
          </div>
          : ""}
       </nav>
      <nav class="div-nav">
        <ul class="menu"> 
        </ul>
      </nav>
      <section class="ftco-section">
        {/* modal login start */}

        <Modal isOpen={modalLogin} >
          <ModalHeader style={{ display: 'float' }}>
            <button className='btn btn-outline-outline btn-sm-primary  ' style={{ float: 'right' }} onClick={() => { updateEstadeModalLogin() }} >x
            </button>
          </ModalHeader>
          <ModalBody>

            <div className='form-group'>

              <label htmlFor="title">Email</label>
              <input className='form-control' type="email" name="email" id="email" rows={5} onChange={(p) => handleChangeBodyParameters(p)} />
              <br />
              <label htmlFor="title">Password</label>
              <input className='form-control' type="password" name="password" id="email" rows={5} onChange={(p) => handleChangeBodyParameters(p)} />
              <br />
            </div>

          </ModalBody>
          <ModalFooter>

            <button className='btn btn-outline-success btn-sm' onClick={() => { requestLogin(bodyParameters); updateEstadeModalLogin(bodyParameters) }}> Ingresar</button>
            <button className='btn btn-outline-danger btn-sm' onClick={() => { updateEstadeModalLogin() }}>Cancelar</button>

          </ModalFooter>

        </Modal>


        {/* modal login finish- --------------------------------------- */}
        {/* modal logout start - --------------------------------------- */}

        <Modal isOpen={modalLogout}>
          <ModalBody>
            <p>¿Estas seguro que quieres desloguearte?</p>

          </ModalBody><ModalFooter>
            <button className="btn btn-danger" onClick={() => { logout(); updateEstadeModalLogout() }}>Si</button>
            <button className="btn btn-primary" onClick={() => { updateEstadeModalLogout() }}>No</button>
          </ModalFooter>
        </Modal>

        {/* modal logout finish - --------------------------------------- */}
        {/* modal update start*/}
        {/* // start modal TITLE -------------------------------------- */}
        <Modal isOpen={modalEdit || modalAdd} >
          <ModalHeader style={{ display: 'float' }}>
            <button className='btn btn-outline-outline btn-sm-primary  ' style={{ float: 'right' }} onClick={() => { modalEdit ? updateModalEdit() : modifModalAdd() }} >x
            </button>
          </ModalHeader>
          <ModalBody>
            <div className='form-group' key={file.id}>

              {/* <label htmlFor='creationDate'></label><br />  Fecha Creacion: {" "} */}
              <input type="date" name="creationDate" id="creationDate" hidden defaultValue={modalEdit ? file.creationDate : ""} onChange={(e) => handleModifFile(e)} readOnly />
              <br />
              <br />
              <label htmlFor="numberFile">Número de epxediente</label>
              <input className='form-control' type="text" name="numberFile" id="numberFile" defaultValue={modalEdit ? file.numberFile : ""} onChange={(p) => handleModifFile(p)} />
              <br />
              <label htmlFor="title">Carátula</label>
              <input className='form-control' type="text" name="title" id="title" defaultValue={modalEdit ? file.title : ""} onChange={(p) => handleModifFile(p)} />
              <br />

              <label htmlFor='expirationDate'>Fecha de vencimiento:</label><br />  {" "}
              <input type="date" name="expirationDate" id="expirationDate" min="2002-01-01" defaultValue={modalEdit ? file.expirationDate : ""} onChange={(e) => handleModifFile(e)} />
              <br />


            </div>


            <br />
          </ModalBody>
          <ModalFooter>
            {modalEdit
              ? <button className='btn btn-outline-success btn-sm' onClick={() => { requestPut(file.id, file); updateModalEdit() }}> Actualizar</button>
              : <button className='btn btn-outline-dark primary btn-sm' onClick={() => { requestPost(file); modifModalAdd() }}>Insertar</button>
            }

            <button className='btn btn-outline-danger btn-sm' onClick={() => { modalEdit ? updateModalEdit() : modifModalAdd() }}>Cancelar</button>

          </ModalFooter>
        </Modal>
        {/* modal update finish*/}
        <Modal isOpen={modalDelete}>
          {/* devolverEstadoEliminar() */}
          <ModalBody>
            <h4>¿Estas seguro que quieres eliminar el expediente {file.numberFile}?</h4>

          </ModalBody><ModalFooter>
            <button className="btn btn-danger" onClick={() => { requestDeleteById(file.id); }}>Si</button>
            <button className="btn btn-primary" onClick={() => { modifModalDelete(); }}>No</button>
          </ModalFooter>
        </Modal>
        {/* end modal delete */}


        <div class="container">

          <div class="row justify-content-center">
            <div class="col-md-6 text-center mb-5">

              <h2 class="heading-section">SECRETARIA TECNICA JAR - SALA I</h2>
            </div>
          </div>
          {isLog ?

            <div class="row">
              <div class="col-md-12">
                <h4 class="text-center mb-4">REGISTRO DE EXPEDIENTES ART 71° LEY 831-A   <button className='btn btn-primary' onClick={() => { modifModalAdd() }}>Agregar nuevo expediente</button></h4>

                <div class="table-wrap">
                  <table class="table">
                    <thead class="thead-primary">
                      <tr>
                        <th>EXPTE N°</th>
                        <th>CARATULA</th>
                        <th>FECHA DE AGREGADO</th>
                        <th>FECHA DE VENCIMIENTO</th>
                        <th>CONFIG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFiles && getFiles.map(
                        f => {
                          return (

                            <tr key={f.id}>
                              <th scope="row" class="scope" >{f.numberFile}</th>
                              <td>{f.title}</td>
                              <td> {moment(f.creationDate).format("DD-MM-YYYY")}</td>
                              <th scope="row" class="scope" >{moment(f.expirationDate).format("DD-MM-YYYY")}</th>
                              <td>
                                <a href="#" class="btn btn-primary" onClick={() => { reguestGetById(f.id); updateModalEdit(); }}>ACTUALIZAR</a> {"  "}
                                <a href="#" class="btn btn-primary" onClick={() => { reguestGetById(f.id); modifModalDelete(); }}>BORRAR</a>

                              </td>
                            </tr>
                          )
                        })}
                      {getFiles.length ?
                        <footer>
                          {prevPath || desc.description && prevPath
                            ? <button className='btn btn-primary' onClick={() => { desc.description ? requestGetdescr(prevPath) : requestGet(prevPath); }}>Volver</button>
                            : <button className='btn btn-primary' onClick={() => { desc.description ? requestGetdescr(prevPath) : requestGet(prevPath); }} disabled>Volver</button>
                          }
                          {nextPath || desc.description && nextPath
                            ? <button className='btn btn-primary' onClick={() => { desc.description ? requestGetdescr(nextPath) : requestGet(nextPath); }}>Siguiente</button>
                            : <button className='btn btn-primary' onClick={() => { desc.description ? requestGetdescr(nextPath) : requestGet(nextPath); }} disabled> Siguiente</button>
                          }
                        </footer>
                        : ""}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            : ""}
        </div>
      </section>
    </>
  );
}

export default App;
