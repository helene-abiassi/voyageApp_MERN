import useMyFetch from "../hooks/useMyFetch";

function ExperienceWithCHook() {
  const { data, error, loading } = useMyFetch(
    "http://localhost:5005/api/experiences/all"
  );

  console.log("data from cHook :>> ", data);

  return <div>ExperienceWithCHook</div>;
}

export default ExperienceWithCHook;
