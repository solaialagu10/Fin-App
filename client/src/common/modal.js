import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './styles.css';
function ModalOutlet(props) {

    const clickHandler =() =>{
        props.onHide();
        props.function();
    }

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal show={props.show} onHide={props.onHide} centered  >       
        <Modal.Body >
          <p>{props.body}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>NO</Button>
          <Button variant="primary" onClick={() => clickHandler()}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default ModalOutlet;