interface Props {
  numLines: number;
  numTokens: number;
  errors: string[];
}

export default function Errors({ numLines, numTokens, errors }: Props) {
  return (
    <>
      <div>
        Analyzed <b>{numLines}</b> lines and found <b>{numTokens}</b> tokens in
        document with <b>{errors.length}</b> error
        {errors.length === 1 ? "" : "s"}
        {errors.length === 0 ? "." : ":"}
      </div>
      <ul>
        {errors.map((e) => (
          <li key={e} style={{ color: "red" }}>
            {e}
          </li>
        ))}
      </ul>
    </>
  );
}
