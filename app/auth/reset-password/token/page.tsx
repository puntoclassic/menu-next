
import AccountManage from "@/components/AccountManage";
import CartButton from "@/components/CartButton";

import Header from "@/components/Header";
import HeaderMenu from "@/components/HeaderMenu";
import HomeButton from "@/components/HomeButton";
import Topbar from "@/components/Topbar";
import TopbarLeft from "@/components/TopbarLeft";
import TopbarRight from "@/components/TopbarRight";

import BreadcrumbLink from "@/components/BreadcrumbLink";
import Messages from "@/components/Messages";
import ResetPasswordUpdateForm from "@/components/forms/ResetPasswordUpdateForm";
import { redirect } from "next/navigation";
import BreadcrumbContainer from "@/components/BreadcrumbContainer";
import BreadcrumbDivider from "@/components/BreadcrumbDivider";
import BreadcrumbText from "@/components/BreadcrumbText";

export async function generateMetadata({ params }: any) {
  return {
    title: "Reset password",
  }
}

async function validateRequest(searchParams: any) {
  if (!searchParams.token) {
    redirect("/auth/login");
  }
}

export default async function ResetPassword({ searchParams }: any) {

  await validateRequest(searchParams);

  return (
    <main className="flex flex-col flex-grow">
      <Topbar>
        <TopbarLeft>
          <HomeButton></HomeButton>
        </TopbarLeft>
        <TopbarRight>
          <CartButton></CartButton>
          <AccountManage></AccountManage>
        </TopbarRight>
      </Topbar>

      <Header></Header>
      <HeaderMenu>
        <BreadcrumbContainer>
          <BreadcrumbLink href="/auth/login">
            Profilo
          </BreadcrumbLink>
          <BreadcrumbDivider></BreadcrumbDivider>
          <BreadcrumbText>Reset password</BreadcrumbText>
        </BreadcrumbContainer>
      </HeaderMenu>
      <div className="px-8 pt-8">
        <Messages></Messages>
      </div>
      <div className='flex flex-grow flex-col justify-center items-center'>
        <ResetPasswordUpdateForm />
      </div>
    </main>
  );
}

