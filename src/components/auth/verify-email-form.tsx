"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import axios from "axios"; // Import axios

export const VerifyEmailForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing Token");
      return;
    }

    axios
      .post("/api/verify-email", { token })
      .then((response) => {
        console.log(response.data.success);

        setSuccess(response.data.success);
        setError(response.data.error);
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <>
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className="text-3xl font-semibold">
              Email Verification
            </h1>
            <p className="text-muted-foreground text-sm">Verifying your email</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center w-full justify-center">
            {!success && !error && <BeatLoader />}
            <FormSuccess message={success} />
            <FormError message={error} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="font-normal w-full"
            size="sm"
            asChild
          >
            <Link href="/auth/login">Back to login?</Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
