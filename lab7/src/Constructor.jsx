import { useState, useEffect } from 'react'
import "./assets/css/style.css"
import { Link, useLocation } from 'react-router-dom'

function SiteConstructor({ isEditable, setEditable }) {
	const [background, setBackground] = useState(""); 
	const location = useLocation();
	const [isBoard, setBoard] = useState(false);

	const paths = {
	    "/": {
	    	title: "Доска объявлений",
	    	bg: "board"
	    },
	    "/cats": {
	    	title: "Доска котиков",
	    	bg: "cats"
	    },
	    "/store": {
	    	title: "Доска товаров",
	    	bg: "store"
	    },
	    "/memes": {
	    	title: "Доска мемов",
	    	bg: "board"
	    }
	};

	useEffect(() => {
		const bg = paths[location.pathname]?.bg || "board";
		setBackground(`/img/bg-${bg}.jpg`);

		setBoard(location.pathname === "/");

	}, [location.pathname]);


	return (
		<>
			<div className="background" style={{backgroundImage: `url(${background})`}}>
				<header>
					<img src="/img/sign.png" className="sign untouchable" />
					<nav>	
				        <Link to="/"><button>Объявления</button></Link>
				        <Link to="/cats"><button>Котики</button></Link>
				        <Link to="/store"><button>Магазин</button></Link>
				        <Link to="/memes"><button>Мемы</button></Link>
				    </nav>
				    {isBoard && (
				    	<>
				    		<img onClick={() => setEditable(!isEditable)} className="pencil" src="img/pencil.png" />
				    		<img style={{display: isEditable ? "block" : "none"}} className="plus" src="img/plus.png" />
			    		</>
			    	)}
				    <h1 className="title untouchable">{paths[location.pathname].title}</h1>
				</header>
			</div>
		</>
	)
}

export default SiteConstructor