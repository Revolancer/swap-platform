import { Form } from "@/components/forms/form";
import { InputInner, InputOuter } from "@/components/forms/input";
import { Card } from "@/components/layout/cards";
import { LoginLayout } from "@/components/layout/layouts";
import { FormButton } from "@/components/navigation/button";
import { H4 } from "@/components/text/headings";

export default function Register() {
  return (
    <>
      <LoginLayout>
        <Card css={{ gridColumn: "4 / 10" }}>
          <H4 css={{ textAlign: "center" }}>Welcome to Revolancer! 🤩</H4>
          <Form>
            <InputOuter>
              <InputInner
                type="email"
                name="email"
                id="email"
                required
                placeholder="Email"
                aria-label="Email"
              ></InputInner>
            </InputOuter>
            <InputOuter>
              <InputInner
                type="password"
                name="password"
                id="password"
                minLength={10}
                maxLength={30}
                required
                placeholder="Password"
                aria-label="Password"
              ></InputInner>
            </InputOuter>
            <InputOuter>
              <InputInner
                type="password"
                name="repeatpassword"
                id="repeatpassword"
                minLength={10}
                maxLength={30}
                required
                placeholder="Repeat Password"
                aria-label="Repeat Password"
              ></InputInner>
            </InputOuter>
            <FormButton>Register</FormButton>
          </Form>
        </Card>
      </LoginLayout>
    </>
  );
}
