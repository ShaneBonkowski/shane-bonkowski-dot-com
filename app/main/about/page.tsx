export default function Page() {
  return (
    <div
      className="max-w-3xl mx-auto written-content-container"
      id={"about"}
      aria-label={`Page content for 'about'`}
    >
      <h1>Shane Bonkowski</h1>
      <h2>Engineering, Games, Art, Writing, and anything in between.</h2>
      <p>
        I&apos;m a lifelong learner with a degree in Aerospace Engineering from
        the University of Maryland, College Park. I love creating—whether
        it&apos;s games, short stories, art, or even this custom website.
      </p>
      <p>
        Everything on this website is open source and available on my{" "}
        <a
          href="https://github.com/ShaneBonkowski"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        . Feel free to use my code as a starting point to create your own
        content.
      </p>
      <p>
        Shanes Games embodies the recreational side of me. If you&apos;d like to
        learn more about my professional background, visit my{" "}
        <a
          href="https://www.linkedin.com/in/shanebonkowski/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>{" "}
        profile. I&apos;m always open to collaborate, exchange ideas, and make
        new connections.
      </p>
    </div>
  );
}
