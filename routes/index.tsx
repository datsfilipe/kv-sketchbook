import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { State, TimelineImage, User } from "🛠️/types.ts";
import { getUserBySession, listGlobalTimelineImage } from "🛠️/db.ts";
import { CreateOrLogin } from "🧱/Cta.tsx";
import { Breadcrumbs, Page } from "🧱/Breadcrumbs.tsx";

import { Header } from "🧱/Header.tsx";
import { APP_NAME } from "🛠️/const.ts";
import { Timeline } from "🧱/Gallery.tsx";

interface Data {
  user: User | null;
  images: TimelineImage[];
}

export async function handler(req: Request, ctx: HandlerContext<Data, State>) {
  const images = await listGlobalTimelineImage(true);

  if (!ctx.state.session) {
    return ctx.render({ user: null, images });
  }
  const user = await getUserBySession(ctx.state.session);
  if (!user) {
    return ctx.render({ user: null, images });
  }

  return ctx.render({ user, images });
}

const pages = [{
  name: "Home",
  href: "/",
  current: true,
}] as Page[];

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <Header user={props.data?.user ?? null} />

      <div class="mt-4">
        <Breadcrumbs pages={pages} />
      </div>
      <Top {...props.data} />
    </>
  );
}

function Top(props: Data) {
  return (
    <>
      <div class="">
        <CreateOrLogin user={props.user} />

        <Timeline images={props.images} />
      </div>
    </>
  );
}
