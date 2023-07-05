import { FormButton } from "../navigation/button";
import { H5 } from "../text/headings";
import { Span } from "../text/text";

export const DeleteAccount = () => {
  return (
    <>
      <H5>Close Account</H5>
      <Span css={{ color: "$neutral700" }}>
        Do you want to permanently close your account?
      </Span>
      <FormButton onClick={() => {}} role="dangerous">
        Close my account
      </FormButton>
    </>
  );
};
