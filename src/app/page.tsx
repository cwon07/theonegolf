import Image from "next/image";
import { createUser } from "./lib/actions/user.actions";

export default function Home() {
  return (
    <form
      action="/api/createUser"
      method="post" 
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" required />
      </div>
      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" name="firstName" type="text" required />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" name="lastName" type="text" required />
      </div>
      <div>
        <label htmlFor="email">Email Address</label>
        <input id="email" name="email" type="email" required />
      </div>
      <button type="submit" style={{ marginTop: "1rem" }}>
        Submit
      </button>
    </form>
  );
}