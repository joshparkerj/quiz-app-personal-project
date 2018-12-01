import React from 'react';

function Nav({ loggedIn, admin, hc }) {
  return (
    <div className="nav">
      {loggedIn ? (
        <div className="user-pages">
          <button onClick={() => hc("join-create")}>
            Join or Create a Game
            </button>
          <button onClick={() => hc("quiz")}>
            Take a Quiz
            </button>
          <button onClick={() => hc("multi-wiki")}>
            Take a multiple choice wiki quiz
            </button>
          <button onClick={() => hc("mc")}>
            Take a multiple choice quiz
            </button>
          {admin ? (
            <div className="admin-pages">
              <button onClick={() => hc("admin")}>
                Admin page
                </button>
            </div>
          ) : (
              <p>Thanks for visiting!</p>
            )}
        </div>
      ) : (
          <p>Not Logged In</p>
        )}
    </div>
  )
}

export default Nav;
