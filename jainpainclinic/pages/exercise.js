import fs from "fs";
import path from "path";
import Head from "next/head";
import Script from "next/script";

function normalizeExerciseMarkup(html) {
  return html
    .replace(/href="assets\//g, 'href="/assets/')
    .replace(/src="assets\//g, 'src="/assets/');
}

export default function ExercisePage({ exerciseMarkup }) {
  return (
    <>
      <Head>
        <title>Exercises for Neck, Back, Knee &amp; Hip Pain Relief | Jain Pain Clinic Gurgaon</title>
        <meta
          name="description"
          content="Free exercise videos for neck pain, back pain, knee pain, hip pain, and shoulder pain. Expert-recommended movements by Dr. Ashu Kumar Jain that you can safely do at home."
        />
        <meta
          name="keywords"
          content="neck pain exercises, back pain exercises, knee pain exercises, hip pain exercises, shoulder pain exercises, frozen shoulder exercises, osteoarthritis exercises, cervical pain exercises, pain relief exercises at home, chronic pain exercises Gurgaon"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.jainpainclinic.com/exercise" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Exercises for Neck, Back, Knee &amp; Hip Pain Relief | Jain Pain Clinic"
        />
        <meta
          property="og:description"
          content="Free exercise videos for neck pain, back pain, knee pain, hip pain, and shoulder pain. Doctor-recommended movements you can safely do at home."
        />
        <meta property="og:url" content="https://www.jainpainclinic.com/exercise" />
        <meta property="og:image" content="https://www.jainpainclinic.com/assets/logo.png" />
        <meta property="og:site_name" content="Jain Pain Clinic" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Exercises for Neck, Back, Knee &amp; Hip Pain Relief | Jain Pain Clinic"
        />
        <meta
          name="twitter:description"
          content="Free exercise videos for neck pain, back pain, knee pain, hip pain, and shoulder pain. Doctor-recommended movements you can safely do at home."
        />
        <meta name="twitter:image" content="https://www.jainpainclinic.com/assets/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Exercises for Neck, Back, Knee & Hip Pain Relief",
              description:
                "Free exercise videos for neck pain, back pain, knee pain, hip pain, and shoulder pain. Expert-recommended movements by Dr. Ashu Kumar Jain.",
              url: "https://www.jainpainclinic.com/exercise",
              author: { "@type": "Person", name: "Dr Ashu Kumar Jain" },
              publisher: {
                "@type": "MedicalOrganization",
                name: "Jain Pain Clinic",
                url: "https://www.jainpainclinic.com",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Can exercises really help reduce chronic neck, back, knee, or hip pain?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Targeted exercises strengthen the muscles that support painful joints and the spine, reducing the mechanical load that drives chronic pain. Regular movement also improves circulation, decreases inflammation, and releases endorphins, which are your body's natural pain-relief chemicals. Most patients notice meaningful improvement in pain intensity and daily function within 4 to 6 weeks of consistent exercise.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How often should I do these pain relief exercises?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "For most chronic pain conditions, performing the exercises 5 to 7 days a week gives the best results. Start with one session per day and allow at least one rest day per week as your body adapts. Consistency matters more than intensity. Short daily sessions of 10 to 15 minutes are far more effective than infrequent longer workouts.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is it safe to exercise when I am already in pain?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Gentle, guided movement is usually safe and even beneficial during mild-to-moderate pain. A level of mild discomfort during exercise is normal and different from sharp, shooting, or worsening pain. If any exercise increases your pain beyond a 4 out of 10, stop and consult your doctor. Always get medical clearance before starting if you have had a recent injury, surgery, or severe nerve symptoms.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What should I do if an exercise makes my pain worse?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Stop the exercise immediately and rest. Mild post-exercise soreness lasting less than 24 hours is generally fine, but sharp pain, numbness, tingling, or pain that persists beyond a day signals that the movement may not suit your current condition. Note which exercise caused the problem and inform your doctor or physiotherapist before attempting it again.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can exercises replace medical or interventional pain treatment?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Exercises are a powerful complement to medical treatment but rarely replace it for moderate-to-severe chronic pain. Interventional procedures like epidural steroid injections or radiofrequency ablation reduce pain enough to allow you to exercise effectively. They work best together: pain relief procedures open a window of reduced pain, and exercises make that permanent by building long-term strength and stability.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long before I see improvement from doing these exercises regularly?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most people notice improved mobility and reduced stiffness within 2 to 3 weeks. Meaningful pain reduction typically appears by 4 to 6 weeks, while significant strength gains and sustained pain relief usually take 8 to 12 weeks of regular practice. Progress is not always linear. Some days will feel harder than others, which is completely normal.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are the exercises suitable for elderly patients or those with osteoarthritis?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. The exercises demonstrated are low-impact and designed to be gentle on aging joints. For osteoarthritis of the knee or hip in particular, regular low-resistance movement reduces joint stiffness and cartilage degradation. Elderly patients should begin with the easier range-of-motion movements, progress gradually, and use a chair or wall for balance support where needed.",
                  },
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.jainpainclinic.com/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Exercises for Pain Relief",
                  item: "https://www.jainpainclinic.com/exercise",
                },
              ],
            }),
          }}
        />
      </Head>

      <div dangerouslySetInnerHTML={{ __html: exerciseMarkup }} />

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-2R0G1WLVX7"
        strategy="afterInteractive"
      />
      <Script id="google-analytics-exercise" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2R0G1WLVX7');
        `}
      </Script>
      <Script src="/home-script.js" strategy="afterInteractive" />
    </>
  );
}

export async function getStaticProps() {
  const exercisePath = path.join(process.cwd(), "content", "legacy-site", "exercise.html");
  const exerciseHtml = fs.readFileSync(exercisePath, "utf8");
  const bodyMatch = exerciseHtml.match(/<body>([\s\S]*?)<script src="script\.js"><\/script>/);

  return {
    props: {
      exerciseMarkup: normalizeExerciseMarkup(bodyMatch ? bodyMatch[1] : ""),
    },
  };
}
