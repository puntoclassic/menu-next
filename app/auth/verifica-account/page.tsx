
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
import VerificaAccountForm from "@/components/forms/VerificaAccountForm";
import BreadcrumbContainer from "@/components/BreadcrumbContainer";
import BreadcrumbDivider from "@/components/BreadcrumbDivider";
import BreadcrumbText from "@/components/BreadcrumbText";
import mailService from "@/src/services/mailService";
import { pushMessage } from "@/src/services/messageService";
import { VerifyAccountFields, MessageType } from "@/src/types";
import { redirect } from "next/navigation";
import { getUserByEmail, generateNewActivationToken } from "@/src/services/accountService";

export async function generateMetadata({ params }: any) {
  return {
    title: "Verifica account",
  }
}

async function action(object: VerifyAccountFields) {
  'use server';
  var { email } = object;

  if (email) {
    var user = await getUserByEmail(email);

    if (user) {
      var token = await generateNewActivationToken(email);
      var activationUrl = `${process.env.SERVER_URL}/auth/verifica-account/token?token=${token}&email=${email}`;
      mailService.initService();
      await mailService.sendActivateAccountCode(user.email, activationUrl);
    }

    pushMessage({
      text: "Controlla la tua email per attivare il tuo account",
      type: MessageType.SUCCESS,
    });
  } else {
    pushMessage({
      text: "Richiesta non valida",
      type: MessageType.ERROR,
    });
  }
  redirect(`/auth/login`);
}


export default async function Page({ searchParams }: any) {


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
          <BreadcrumbText>Verifica account</BreadcrumbText>
        </BreadcrumbContainer>
      </HeaderMenu>
      <div className="px-8 pt-8">
        <Messages></Messages>
      </div>
      <div className='flex flex-grow flex-col justify-center items-center'>
        <VerificaAccountForm action={action}></VerificaAccountForm>
      </div>
    </main>
  );
}

