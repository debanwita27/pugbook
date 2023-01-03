import React from "react";
import "./App.css";
import UserContext from "./usercontext";
import Comments from "./components/Comments.jsx";

/**
 * { userId, content, upvotes, downvotes }
 */

async function getJSONFromUrl(url) {
	const res = await fetch(url);
	const data = await res.json();
	return data;
}

function DogCard({ showDefault }) {
	const State = {
		Dog: "Dog",
		Loading: "Loading",
	};

	if (!showDefault)
		React.useEffect(() => {
			updateDogInfo();
		}, []);

	const defaultMahato = {
		name: "Debanwita (Mommy) Mahato",
		image: "https://qph.cf2.quoracdn.net/main-thumb-100592942-200-orfwmxgvvoffafzecyxckqptsmcczabr.jpeg",
		quote: "Sometimes the person you'd take a bullet for is beind the trigger",
	};

	const [dogInfo, setDogInfo] = React.useState(showDefault ? defaultMahato : null);
	const [state, setState] = React.useState(dogInfo ? State.Dog : State.Loading);

	/**
	 * @returns A URI to a dog image.
	 */
	async function fetchDog() {
		try {
			const response = await getJSONFromUrl("http://localhost:3001/random/1");
			return response[0];
		} catch (err) {
			return null;
		}
	}

	async function updateDogInfo() {
		setState(State.Loading);
		const dogInfo = await fetchDog();
		if (!dogInfo) return;
		setState(State.Dog);
		setDogInfo(dogInfo);
	}

	if (state == State.Loading) return "Loading...";

	return (
		<div className="dogCard">
			<img src={dogInfo.image} onClick={updateDogInfo} alt="dog" width="200" />
			<div>
				<strong className="dogName">{dogInfo.name}</strong>
			</div>
			<div className="dogBio">{dogInfo.quote}</div>
		</div>
	);
}

function LogInSection() {
	const userRef = React.useRef(null);
	const passRef = React.useRef(null);
	const { user, setUser } = React.useContext(UserContext);
	console.log(user);
	return (
		<>
			<input ref={userRef} type="text" placeholder="username" />
			<input ref={passRef} type="password" />
			<button
				onClick={() => {
					setUser({ id: userRef.current.value, isLoggedIn: true });
				}}
			>
				Log In
			</button>
		</>
	);
}
function LogOut() {
	const { setUser } = React.useContext(UserContext);
	return (
		<button
			onClick={() => {
				setUser({ id: "debanwita27", isLoggedIn: false });
			}}
		>
			Log out
		</button>
	);
}

function App() {
	const [user, setUser] = React.useState({ id: null, isLoggedIn: false });
	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
			}}
		>
			<h1>Mahato Lineage</h1>
			<h5>(Click an image to see more members of my family)</h5>
			<div className="container">
				{user.isLoggedIn ? <LogOut /> : <LogInSection />}
				<div className="dogCards">
					<DogCard showDefault={true} />
					<DogCard showDefault={false} />
					<DogCard showDefault={false} />
				</div>
				<hr />
				<Comments />
			</div>
		</UserContext.Provider>
	);
}

export default App;
